import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Theme } from "../../../../theme";

export default function Chart({ title, data, name, value }) {
  return (
    <div style={{ height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          title={title}
          desc="Mô tả"
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={name} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            name="Tổng"
            dataKey={value}
            fill={Theme.theme().css.background.color}
            // activeBar={<Rectangle fill="gold" stroke="purple" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
