import { useEffect, useState } from 'react'
import supabase from './../supabase-client';
import { toast } from 'react-toastify';
import NavBar from './../components/NavBar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const TodoPage = () => {
    useEffect(() => {
        if (!localStorage.getItem('QTTY')) {
            navigate('/')
        }
    }, [])
    
    const [newTodo, setNewTodo] = useState('')
    const [todoList, setTodoList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const user = JSON.parse(localStorage.getItem('QTTY'));
    // FOR CREATING
    const handleSubmitTodo = async (e) => {
        e.preventDefault()
        if (!newTodo || newTodo.length < 3) {
            toast.warn('Enter your new task, must be more than 3 characters long')
        } else {
            try {
                setIsLoading(true)
                const user = JSON.parse(localStorage.getItem('QTTY'));
                const uuid = user.id
                const { data, error } = await supabase
                    .from('TodoList')
                    .insert({
                        'name': newTodo,
                        'isCompleted': false,
                        'user_id': uuid
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
        const user = JSON.parse(localStorage.getItem('QTTY'));
        const uuid = user.id
        // console.log(uuid);
        setIsLoading(true)
        const { data, error } = await supabase
            .from('TodoList')
            .select('*')
            .order('createdAt', { ascending: false })
            .eq('user_id', uuid)
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
        <NavBar />
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

                <ul className='list-group shadow-lg py-3 rounded'>
                    {
                        isLoading && <div className="d-flex text-center justify-content-center">
                            <h1 className='fs-5 fst-italic fw-bold text-success'>Adding...</h1>
                        </div>
                    }
                    {todoList.length > 0 ? todoList.map((todo, index) => (
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
                    )) : (
                        <p className='text-center text-success fw-bold fst-italic py-5'>Welcome back, {user?.email?.split('@')[0]}! Add a task below.</p>
                    )}
                </ul>

            </div>
            <Footer />
        </>
    )
}

export default TodoPage
