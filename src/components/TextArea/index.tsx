import React, { Component } from 'react';
import classnames from 'classnames';
import 'prismjs/components/prism-markdown.js';
import { IProps } from '../../utils';
import hotkeys, { IHotkeyOptions } from './hotkeys';
import './index.less';

export interface ITextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'onScroll'>, IProps {
  onChange?: (value?: string) => void;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  value?: string;
  tabSize?: number;
}

export interface ITextAreaState {
  value?: string;
}

export default class TextArea extends Component<ITextAreaProps, ITextAreaState> {
  public preElm = React.createRef<HTMLPreElement>();
  public warp = React.createRef<HTMLDivElement>();
  public text = React.createRef<HTMLTextAreaElement>();
  public static defaultProps: ITextAreaProps = {
    tabSize: 2,
    autoFocus: true,
    spellCheck: false,
  }
  public static state: ITextAreaState;
  public constructor(props: ITextAreaProps) {
    super(props);
    this.state = {
      value: props.value,
    };
  }
  private handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { onChange } = this.props;
    this.setState({ value: e.target.value }, () => {
      onChange && onChange(this.state.value);
    });
  }
  public UNSAFE_componentWillReceiveProps(nextProps: ITextAreaProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }
  public shouldComponentUpdate(nextProps: ITextAreaProps, nextState: ITextAreaState) {
    return nextProps.value !== this.props.value || nextState.value !== this.state.value;
  }
  render() {
    const { prefixCls, className, onChange, onScroll, tabSize, style, ...otherProps } = this.props;
    return (
      <div ref={this.warp} className={classnames(`${prefixCls}-aree`, className)} onScroll={onScroll}>
        <div className={classnames(`${prefixCls}-text`)}>
          <textarea
            {...otherProps}
            ref={this.text}
            onKeyDown={hotkeys.bind(this, { tabSize } as IHotkeyOptions)}
            className={`${prefixCls}-text-input`}
            value={this.state.value}
            onChange={this.handleChange.bind(this)}
          />
        </div>
      </div>
    );
  }
}