import React from 'react'

import { InfiniteList } from 'react-infinite-list'
import 'react-infinite-list/dist/index.css'

const dataSource = new Array(1000000).fill(null).map((item, index) => `${index}: Lorem Ipsum`);
// console.log(dataSource)

const App = () => {
  return <InfiniteList
  dataSource={dataSource}
  cellHeight={200}
  render={(data) => data}
  style={{
    border: '1px solid #000',
    height: 400,
    overflowY: 'scroll'
  }} />
}

export default App
