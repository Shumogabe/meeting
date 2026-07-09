import React from 'react';
import { isEmpty, isEqual } from 'lodash';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
const List = styled.div`
    border: 1px ${(props) => (props.isDraggingOver ? 'dashed #000' : 'solid #ddd')};
    background: #fff;
    padding: 0.5rem 0.5rem 0;
    border-radius: 3px;
    flex: 0 0 150px;
    font-family: sans-serif;
`;
const Kiosk = styled(List)`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 200px;
`;
const Item = styled.div`
    display: flex;
    user-select: none;
    padding: 0.5rem;
    margin: 0 0 0.5rem 0;
    align-items: flex-start;
    align-content: flex-start;
    line-height: 1.5;
    border-radius: 3px;
    background: ${(props) => (props.isDisableDrag ? '#ccc' : '#fff')};
    border: 1px ${(props) => (props.isDragging ? 'dashed #4099ff' : 'solid #ddd')};
`;

const Clone = styled(Item)`
    + div {
        transform: 'none !important';
    }
`;

export const CopyDnD = ({ sources = [], data = [], setData, dataKey, labelKey, onChange, ...props }) => {
    const onDragEnd = ({ source, destination }) => {
        console.log(source, destination);
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }
        // source là phần tử gốc gồm index và id bảng(droppableId), destination là điểm đến gồm index và id bảng(droppableId)
        switch (source.droppableId) {
            case 'origin':
                if (destination.index === 'origin') return;
                // Copy
                if (!isEmpty(sources)) {
                    const arr = [...data];
                    arr.splice(destination.index, 0, sources[source.index]);
                    setData(arr);
                } else {
                    setData([sources[source.index]]);
                }
                break;
            case 'target':
                if (destination.droppableId === 'origin') {
                    // Xóa khỏi mảng
                    const arr = [...data];
                    arr.splice(source.index, 1);
                    setData(arr);
                } else {
                    // re order / đổi vị trí
                    const arr = [...data];
                    // Lưu giá trị của phần tử thứ nhất vào biến tạm thời
                    let temp = arr[source.index];
                    // Gán giá trị của phần tử thứ hai cho phần tử thứ nhất
                    arr[source.index] = arr[destination.index];
                    // Gán giá trị của biến tạm thời cho phần tử thứ hai
                    arr[destination.index] = temp;
                    setData(arr);
                }

                break;
            default:
                // // mặc định
                console.log('Mặc định');
                break;
        }
    };
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div style={{ display: 'flex', gap: '50px', height: '500px', overflowY: 'overlay' }}>
                <Droppable droppableId="origin">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '10px',
                                gap: '10px',
                                backgroundColor: snapshot.isDraggingOver ? '#dee2e6' : '#ebecf1',
                            }}
                        >
                            {sources.map((value, index) => {
                                let isDisableDrag = data.some((vl) => isEqual(value, vl));
                                console.log(value);
                                return (
                                    <Draggable key={dataKey ? value?.[dataKey] : value?.ma + uuidv4()} draggableId={dataKey ? value?.[dataKey] : value?.ma + uuidv4()} index={index}>
                                        {(provided, snapshot) => (
                                            <>
                                                <Item ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} isDragging={snapshot.isDragging} isDisableDrag={isDisableDrag} style={{ ...provided.draggableProps.style, transform: snapshot.isDragging ? provided.draggableProps.style?.transform : 'translate(0px, 0px)' }}>
                                                    {labelKey ? value?.[labelKey] : value?.ten}
                                                </Item>
                                                {snapshot.isDragging && <Clone>{labelKey ? value?.[labelKey] : value?.ten}</Clone>}
                                            </>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                <Droppable droppableId="target">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '10px',
                                gap: '10px',
                                backgroundColor: snapshot.isDraggingOver ? '#dee2e6' : '#ebecf1',
                            }}
                        >
                            {data.map((value, index) => {
                                return (
                                    <Draggable key={dataKey ? value?.[dataKey] : value?.ma + '2'} draggableId={dataKey ? value?.[dataKey] : value?.ma + '2'} index={index}>
                                        {(provided, snapshot) => (
                                            <>
                                                <Item ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} isDragging={snapshot.isDragging} style={provided.draggableProps.style}>
                                                    {labelKey ? value?.[labelKey] : value?.ten}
                                                </Item>
                                            </>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
};
const BeautyDnDBox = ({ box, data = [], labelKey, dataKey, isDropDisabled = false, destinationData }) => {
    return (
        <Droppable droppableId={'box' + box} isDropDisabled={isDropDisabled}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '10px',
                        gap: '10px',
                        backgroundColor: snapshot.isDraggingOver ? '#dee2e6' : '#ebecf1',
                    }}
                >
                    {data.map((value, index) => {
                        let isDisableDrag = false;
                        // Nếu box 1 (box cha)
                        if (box === 1) {
                            destinationData.forEach((vl) => {
                                if (isEqual(value, vl)) {
                                    isDisableDrag = true;
                                }
                            });
                        }
                        return (
                            <Draggable key={dataKey ? value?.[dataKey] : value?.ma} draggableId={dataKey ? value?.[dataKey] : value?.ma} index={index} isDragDisabled={isDisableDrag}>
                                {(provided, snapshot) => (
                                    <>
                                        <Item ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} isDragging={snapshot.isDragging} isDisableDrag={isDisableDrag} style={{ ...provided.draggableProps.style, transform: isDropDisabled ? (snapshot.isDragging ? provided.draggableProps.style?.transform : 'translate(0px, 0px)') : '' }}>
                                            {labelKey ? value?.[labelKey] : value?.ten}
                                        </Item>
                                        {isDropDisabled && snapshot.isDragging && <Clone>{labelKey ? value?.[labelKey] : value?.ten}</Clone>}
                                    </>
                                )}
                            </Draggable>
                        );
                    })}
                    <div style={{ display: !isDropDisabled ? 'none' : 'block' }}>{provided.placeholder}</div>
                </div>
            )}
        </Droppable>
    );
};
