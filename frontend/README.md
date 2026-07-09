## Tree

Dùng Tree để thể hiện cây thư mục bắt đầu từ 1 trung tâm dữ liệu -> tủ rack -> ...

## Steps

Dùng cho đăng ký dịch vụ

## Button

```jsx
<Upload>
  <Button icon={<UploadOutlined />}>Click to Upload</Button>
</Upload>
```

```jsx
<Popconfirm title="Are you sure delete this task?" okText="Yes" cancelText="No">
  <Button>Confirm</Button>
</Popconfirm>
```

## Radio

```jsx
<Radio.Group value={size} onChange={(e) => setSize(e.target.value)}>
  <Radio value="small">Small</Radio>
  <Radio value="middle">Middle</Radio>
  <Radio value="large">Large</Radio>
</Radio.Group>
```
