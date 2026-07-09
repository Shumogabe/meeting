import React from "react";
import { Pagination, Transfer } from "antd";
import Helper from "../../helper/helper";
const App = (props) => {
  const {
    mockData,
    targetKeys,
    handleSearch,
    handleChange,
    renderItem,
    operations,
    filterOption,
    locale,
    titles,
    tableParamsLeft,
    tableParamsRight,
    pageLeft,
    pageRight,
    showSearch,
  } = props;

  //   const [mockData, setMockData] = useState([]);
  //   const [targetKeys, setTargetKeys] = useState([]);
  //   const getMock = () => {
  //     const tempTargetKeys = [];
  //     const tempMockData = [];
  //     for (let i = 0; i < 20; i++) {
  //       const data = {
  //         key: i.toString(),
  //         title: `content${i + 1}`,
  //         description: `description of content${i + 1}`,
  //         chosen: i % 2 === 0,
  //       };
  //       if (data.chosen) {
  //         tempTargetKeys.push(data.key);
  //       }
  //       tempMockData.push(data);
  //     }
  //     setMockData(tempMockData);
  //     setTargetKeys(tempTargetKeys);
  //   };
  // useEffect(() => {
  //   // props.getMock();
  // }, []);

  //   const handleChange = (newTargetKeys, direction, moveKeys) => {
  //     console.log(newTargetKeys, direction, moveKeys);
  //     setTargetKeys(newTargetKeys);
  //   };

  //   const handleSearch = (dir, value) => {
  //     console.log("search:", dir, value);
  //   };

  const renderFooter = (_, { direction }) => {
    if (direction === "left") {
      return (
        <div className="float-right">
          <Pagination
            size="small"
            showTotal={(total) => `Tổng số: ${total}`}
            // showSizeChanger
            current={tableParamsLeft.pagination.current}
            pageSize={tableParamsLeft.pagination.pageSize}
            total={tableParamsLeft.pagination.total}
            onChange={pageLeft}
          />
        </div>
      );
    }
    return (
      <div className="float-right">
        <Pagination
          size="small"
          showTotal={(total) => `Tổng số: ${total}`}
          // showSizeChanger
          current={tableParamsRight.pagination.current}
          pageSize={tableParamsRight.pagination.pageSize}
          total={tableParamsRight.pagination.total}
          onChange={pageRight}
        />
      </div>
    );
  };

  return (
    <Transfer
      dataSource={mockData}
      showSearch={Helper.isNullOrUndefined(showSearch) ? false : true}
      // showSearch={false}
      filterOption={filterOption}
      targetKeys={targetKeys}
      listStyle={{
        width: "100%",
        height: "80vh",
      }}
      onChange={handleChange}
      onSearch={handleSearch}
      render={renderItem}
      // pagination={{ pageSize: 10 }}
      operations={operations} //['to right', 'to left']
      footer={renderFooter}
      locale={locale}
      titles={titles}
    />
  );
};
export default App;
