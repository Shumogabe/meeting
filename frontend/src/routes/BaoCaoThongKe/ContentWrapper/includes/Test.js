import React, { useRef } from "react";
import { Table } from "antd";
import { useReactToPrint } from "react-to-print";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];

const dataSource = Array.from({
  length: 46,
}).map((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32,
  address: `London, Park Lane no. ${i}`,
}));

export default function App() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef?.current,
  });

  const handleClick = () => {
    //console.log(componentRef?.current);
    try {
      //   handlePrint();
      window.print();
    } catch (error) {
      //console.log(error);
    }
    // const printContent = componentRef.current;
    // const windowUrl = URL.createObjectURL(new Blob(['<html><head></head><body>', printContent.outerHTML, '</body></html>'], { type: 'text/html' }));
    // const windowOption = 'status=no,menubar=yes,toolbar=no,scrollbars=yes';
    // const printWindow = window.open(windowUrl, '_blank', windowOption);
    // printWindow.addEventListener('load', () => {
    //   printWindow.print();
    // });
  };

  return (
    <div>
      <div ref={componentRef}>
        <Table locale={{
                          emptyText: "Không có dữ liệu.",
                        }}
          columns={columns}
          dataSource={dataSource}
          pagination={{ pageSize: 2 }}
        />
      </div>
      <button onClick={handleClick}>Print this out!</button>
    </div>
  );
}
