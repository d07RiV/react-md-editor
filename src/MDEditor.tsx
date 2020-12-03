import React from 'react';
import classnames from 'classnames';
import { IProps } from './utils';
import TextArea, { ITextAreaProps } from './components/TextArea';
import Toolbar from './components/Toolbar';
import { getCommands, TextAreaCommandOrchestrator, ICommand, CommandOrchestrator } from './commands';
import './index.less';

export interface MDEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>, IProps {
  /**
   * The Markdown value.
   */
  value?: string;
  /**
   * Event handler for the `onChange` event.
   */
  onChange?: (value?: string) => void;
  /**
   * Can be used to make `Markdown Editor` focus itself on initialization. Defaults to on.
   * it will be set to true when either the source `textarea` is focused,
   * or it has an `autofocus` attribute and no other element is focused.
   */
  autoFocus?: ITextAreaProps['autoFocus'];
  /**
   * The height of the editor.
   */
  height?: React.CSSProperties['height'];
  /**
   * Maximum drag height. `visiableDragbar=true`
   */
  maxHeight?: number;
  /**
   * Minimum drag height. `visiableDragbar=true`
   */
  minHeight?: number;
  /**
   * Set the `textarea` related props.
   */
  textareaProps?: ITextAreaProps;
  /**
   * The number of characters to insert when pressing tab key.
   * Default `2` spaces.
   */
  tabSize?: number;
  /**
   * You can create your own commands or reuse existing commands.
   */
  commands?: ICommand[];
  /**
   * Hide the tool bar
   */
  hideToolbar?: boolean;
}

export interface MDEditorState {
  height: React.CSSProperties['height'];
  value?: string;
}

export default class MDEditor extends React.PureComponent<MDEditorProps, MDEditorState> {
  public static displayName = 'MDEditor';
  public textarea = React.createRef<TextArea>();
  public commandOrchestrator!: CommandOrchestrator;
  public leftScroll:boolean = false;
  public static defaultProps: MDEditorProps = {
    value: '',
    prefixCls: 'w-md-editor',
    height: 200,
    minHeight: 100,
    maxHeight: 1200,
    tabSize: 2,
    commands: getCommands(),
  }
  public constructor(props: MDEditorProps) {
    super(props);
    this.state = {
      height: props.height,
      value: props.value,
    };
  }
  public componentDidMount() {
    this.handleChange(this.state.value);
    this.commandOrchestrator = new TextAreaCommandOrchestrator((this.textarea.current!.text.current || null) as HTMLTextAreaElement);
  }
  public UNSAFE_componentWillReceiveProps(nextProps: MDEditorProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value }, () => {
        this.handleChange(nextProps.value);
      });
    }
  }
  private handleChange(mdStr?: string) {
    const { onChange } = this.props;
    onChange && onChange(mdStr || '');
  }
  public handleCommand = (command: ICommand) => {
    this.commandOrchestrator.executeCommand(command);
  }
  public render() {
    const { prefixCls, className, value, commands, height, textareaProps, maxHeight, minHeight, autoFocus, tabSize, onChange, hideToolbar, ...other } = this.props;
    const cls = classnames(className, prefixCls, `${prefixCls}-show-edit`);
    return (
      <div className={cls} style={{ height: this.state.height }} {...other}>
        {!hideToolbar && <Toolbar
          active={{}}
          prefixCls={prefixCls} commands={commands}
          onCommand={this.handleCommand}
        />}
        <div
          className={`${prefixCls}-content`}
          style={{ height: (this.state.height as number) - 29 }}
        >
          <TextArea
            ref={this.textarea}
            tabSize={tabSize}
            className={`${prefixCls}-input`}
            prefixCls={prefixCls}
            value={this.state.value}
            autoFocus={autoFocus}
            {...textareaProps}
            onMouseOver={() => this.leftScroll = true}
            onMouseLeave={() => this.leftScroll = false}
            onChange={this.handleChange.bind(this)}
          />
        </div>
      </div>
    )
  }
}
