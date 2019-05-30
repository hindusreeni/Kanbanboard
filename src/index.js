import React from 'react';
import ReactDOM from 'react-dom';
import {DragDropContext} from 'react-beautiful-dnd';
import Column from './column';
import styled from 'styled-components';


const Container=styled.div`
    display:flex
`

const Button = styled.button`
    padding: 8px;
    margin-left:8px;
`

const Input = styled.input`
    width: 210px;
    border-radius:2px; 
    border:1px solid lightgrey;
    padding:8px;
    margin-left:8px;

`
class App extends React.Component{

    state = {
        tasks: {

        },
        columns:{
            'column-1':{
                id:'column-1',
                title:'To Do',
                taskIds:[]
            },
            'column-2':{
                id:'column-2',
                title:'Progress',
                taskIds:[]
            },
            'column-3':{
                id:'column-3',
                title:'Done',
                taskIds:[]
            },
        },
        columnOrder:['column-1', 'column-2', 'column-3'],
        inputValue: '',
        count: 0
    }

    onDragEnd = result => {
    const {destination, source, draggableId }=result;
   
        if(!destination)
            return;
        if(destination.droppableId===source.droppableId && destination.index===source.index)
            return;

        const start=this.state.columns[source.droppableId];
        const finish=this.state.columns[destination.droppableId];

        if(start===finish){

            const newTaskIds= Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index,0,draggableId);
    
            const newColumn={
                ...start,
                taskIds:newTaskIds,
            };
            const newState={
                ...this.state,
                columns:{
                    ...this.state.columns,
                    [newColumn.id]:newColumn,
                },     
            };
            this.setState(newState);
            return;
        }

        const startTaskIds=Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart={
            ...start,
            taskIds:startTaskIds,
        };

        const finishTaskIds=Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index,0,draggableId);
        const newFinish={
            ...finish,
            taskIds:finishTaskIds,
        }

        const newState={
            ...this.state,
            columns:{
                ...this.state.columns,
            [newStart.id]:newStart,
            [newFinish.id]:newFinish,
            },
        };
        this.setState(newState);
        return;

    };

    handleAddItem = () =>{
        const {tasks, inputValue, columns, count} = this.state;
        const newTask = {
            id: count + 1,
            content: inputValue
        }  
        const updatedColumn = {...columns['column-1'], taskIds: [...columns['column-1'].taskIds, count + 1]}
        this.setState({ tasks: 
            {[count + 1] : newTask, ...tasks}, 
            columns: {...columns, 'column-1': updatedColumn},
            count: count + 1,
            inputValue: ''
            })
    }

    render(){
        const {inputValue} = this.state;
        return(
        <DragDropContext onDragEnd={this.onDragEnd}>
        <Container>
           {this.state.columnOrder.map(columnId=>{
                const column=this.state.columns[columnId];
                const tasks=column.taskIds.map(taskId=>this.state.tasks[taskId]);
                return <Column key={column.id} column={column} tasks={tasks}/>;
            }
        )}
        </Container>
        <Input value={inputValue} onChange={(e) => this.setState({inputValue: e.target.value}) } />
        <Button 
        onClick={this.handleAddItem}
        disabled={inputValue === ''}
        >Add item</Button>
        </DragDropContext>
        ); 
    }
}


ReactDOM.render(<App />, document.getElementById('root'));
