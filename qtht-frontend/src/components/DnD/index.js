import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

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
    background: #fff;
    border: 1px ${(props) => (props.isDragging ? 'dashed #4099ff' : 'solid #ddd')};
`;

const Clone = styled(Item)`
    + div {
        transform: 'none !important';
    }
`;

export const MyBeautyDnDBox = ({ source = [], uniqueKey, data = [], onChange, ...props }) => {
    const onDragEnd = (payload) => {
        onChange(payload);
    };
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div style={{ display: 'flex', gap: '50px' }}>
                <BeautyDnDBox box={1} isDropDisabled={true} data={source} {...props} />
                <BeautyDnDBox box={2} data={data} {...props} />
            </div>
        </DragDropContext>
    );
};
const BeautyDnDBox = ({ box, data = [], labelKey, isDropDisabled = false }) => {
    return (
        <Droppable droppableId={'droppable' + box} isDropDisabled={isDropDisabled}>
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
                    {data.map((value, index) => (
                        <Draggable key={value?.ma} draggableId={value?.ma} index={index}>
                            {(provided, snapshot) => (
                                <React.Fragment>
                                    <Item ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} isDragging={snapshot.isDragging} style={{ ...provided.draggableProps.style, transform: snapshot.isDragging ? provided.draggableProps.style?.transform : 'translate(0px, 0px)' }}>
                                        {value.ten}
                                    </Item>
                                    {snapshot.isDragging && <Clone>{value.ten}</Clone>}
                                </React.Fragment>
                            )}
                        </Draggable>
                    ))}
                    {!isDropDisabled && provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};
