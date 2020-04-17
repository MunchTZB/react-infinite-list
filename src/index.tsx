import * as React from 'react'
// import styles from './styles.module.css'

interface Props<T>
  extends Pick<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    'className' | 'style'
  > {
  dataSource: T[]
  cellHeight: number | ((data: T, index: number) => number)
  render: (data: T, index: number) => React.ReactElement
}

interface State {
  currentIndex: number,
  cellPosition: number[]
}

export class InfiniteList<T extends any> extends React.Component<
  Props<T>,
  State
> {
  constructor(props: Props<T>) {
    super(props)
    this.state = {
      currentIndex: 0,
      cellPosition: [],
    }
  }
  wrapperRef = React.createRef<HTMLDivElement>()
  componentDidMount() {
    this.calcPosition()
  }

  calcPosition() {
    const { cellHeight, dataSource } = this.props
    if (typeof cellHeight === 'number') {
      this.setState({
        cellPosition: dataSource.map((item, index) => {
          return index * cellHeight
        })
      })
    } else {
      this.setState({
        cellPosition:dataSource.map((item, index) => {
          return cellHeight(item, index)
        })
      })
    }
  }

  getTotalHeight() {
    const {cellHeight, dataSource} = this.props;
    const last = this.state.cellPosition.length - 1;
    if (typeof cellHeight === 'number') {
      return this.state.cellPosition[last] + cellHeight
    } else {
      return this.state.cellPosition[last] + cellHeight(dataSource[last], last)
    }
  }

  onScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const { scrollTop } = event.currentTarget
    // this.cellPosition.findIndex(())
    let offsetIndex = 0
    console.time('findIndex')
    for (let i = 0; i < this.state.cellPosition.length; i++) {
      if (scrollTop < this.state.cellPosition[i]) {
        offsetIndex = i - 1
        break
      }
    }
    console.timeEnd('findIndex')
    this.setState({
      currentIndex: offsetIndex,
    })
  }

  render() {
    const { props } = this
    const { currentIndex } = this.state
    const renderIndexes = [
      currentIndex - 1,
      currentIndex,
      currentIndex + 1,
      currentIndex + 2,
      currentIndex + 3,
    ]

    return (
      <div
        ref={this.wrapperRef}
        className={props.className}
        onScroll={this.onScroll}
        style={props.style}
      >
        <div style={{
          position: 'relative',
          height: this.getTotalHeight()
        }}>
          {
            renderIndexes.map(index => {
              if ((this.state.cellPosition[index] === undefined)) {
                return null
              }
              return (
                <div key={index} style={{
                  position: 'absolute',
                  transform: `translateY(${this.state.cellPosition[index]}px)`,
                  // @ts-ignore
                  height: props.cellHeight,
                }}>
                  {props.render(props.dataSource[index], index)}
                </div>
              )
            })
          }
          {/* {props.dataSource.map((cellData, index) => {
            return (
              <div
                key={index}
                style={{
                  // @ts-ignore
                  height: props.cellHeight,
                }}
              >
                {props.render(cellData, index)}
              </div>
            )
          })} */}
        </div>
      </div>
    )
  }
}
