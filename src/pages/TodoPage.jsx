import { useEffect, useState } from 'react'
import supabase from './../supabase-client';
import { toast } from 'react-toastify';

const TodoPage = () => {
    const [newTodo, setNewTodo] = useState('')
    const [todoList, setTodoList] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    // FOR CREATING
    const handleSubmitTodo = async (e) => {
        e.preventDefault()
        if (!newTodo || newTodo.length < 3) {
            toast.warn('Enter your new task, must be more than 3 characters long')
        } else {
            try {
                setIsLoading(true)
                const { data, error } = await supabase
                    .from('TodoList')
                    .insert({
                        'name': newTodo,
                        'isCompleted': false
                    })
                    .select()
                    .single();
                if (error) {
                    console.log('SUPABASE Error:', error);
                } else {
                    toast.success('Task added successfully')
                    console.log(data);
                    setTodoList(prevTodo => [...prevTodo, data]);
                    setNewTodo('')
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false)
                fetchTodo()
            }
        }
    }
    // FOR FETCHING
    useEffect(() => {
        fetchTodo()
    }, [])
    const fetchTodo = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('TodoList')
            .select('*')
            .order('createdAt', { ascending: false })
        if (error) {
            setIsLoading(false)
            console.log('SUPABASE Error:', error);
        } else {
            setIsLoading(false)
            console.log(data);
            setTodoList(data);
        }
    }
    // FOR UPDATING
    const handleTodoCheck = async (todoId, isCompleted) => {
        console.log(todoId)
        const checkCondition = isCompleted ? false : true;
        const { data, error } = await supabase.from('TodoList')
            .update({
                'isCompleted': checkCondition,
            }).eq('id', todoId)
            .select()
        if (error) {
            console.log('Supabase Error', error);
        } else {
            if (data[0].isCompleted === false) {
                toast.success('Task marked as uncompleted')
            } else {
                toast.success('Task marked as completed')
            }
            fetchTodo()
            console.log(data);
        }
    }
    // FOR DELETING
    const handleDeleteTodo = async (todoId) => {
        const confirm = window.confirm('Are you sure you want to delete this Task')
        if (confirm) {
            const { data, error } = await supabase.from('TodoList')
                .delete()
                .eq('id', todoId)
            if (error) {
                console.log("Supabase error:", error);
            } else {
                fetchTodo()
                toast.success('Task successfully deleted')
                console.log(data.statusText, 'Successfully deleted');
            }
        }
        toast.success('You did not delete the task')
    }
    return (
        <>
            <div className='container-fluid mb-5'>
                <h1 className='mb-3 d-none'>Insert New Task</h1>

                <div className="card border-0 shadow p-3 mb-3">
                    <form onSubmit={handleSubmitTodo}>
                        <div className="mb-3">
                            <label className='mb-3 fw-bold text-primary' htmlFor="formId1">Add a Task</label>
                            <input
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                type="text"
                                className="form-control"
                                placeholder="Insert new task"
                            />
                        </div>
                        <button
                            disabled={isLoading}
                            type="submit"
                            className="btn btn-primary"
                        >
                            {isLoading && 'Adding Task.....'}
                            {!isLoading && 'Add Task'}
                        </button>

                    </form>
                </div>

                <ul className='list-group shadow py-5 rounded'>
                    {
                        isLoading && <div className="d-flex text-center">
                            <h1 className='display-1 text-primary'>Loading...</h1>
                        </div>
                    }
                    {todoList.map((todo, index) => (
                        <li key={todo.id} className='list-group-item d-flex justify-content-between align-items-center'>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className='badge bg-primary  me-3'>{index + 1}</span>
                                <button
                                    className="btn btn-sm btn-danger me-3"
                                >
                                    <i onClick={() => handleDeleteTodo(todo.id)} className='bi bi-trash3'></i>
                                </button>

                                <input
                                    onChange={() => handleTodoCheck(todo.id, todo.isCompleted)}
                                    type="checkbox"
                                    className={`form-check-input me-2 ${todo.isCompleted && 'bg-success'}`}
                                    defaultChecked={todo.isCompleted && 'checked'}
                                />
                            </div>
                            <span className={`text-end ${todo.isCompleted && 'text-decoration-line-through text-success fw-bold'}`}>{todo.name}</span>
                        </li>
                    ))}
                </ul>

            </div>
            <footer className='text-center'>
                <p className='fst-italic text-primary-emphasis fw-bold'>Develop by Hycon</p>
            </footer>
        </>
    )
}

export default TodoPage
