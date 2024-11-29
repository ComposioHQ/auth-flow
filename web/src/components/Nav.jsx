import { useState } from 'react';

const Nav = ({user_id, setUserId}) => {
    const [user_id_input, setUserIdInput] = useState(user_id);
    const updateUserId = () => {
        setUserId(user_id_input);
        localStorage.setItem("user_id", user_id_input);
    }
    return (
        <div className='flex flex-row justify-between items-center'>
            <h1 className='text-center text-3xl font-bold'>Composio Auth Flow</h1>
            <div className='flex flex-row justify-center items-center gap-4'>
                <input
                    type="text"
                    placeholder='Enter User ID'
                    value={user_id_input}
                    className='w-[15rem] h-[2.5rem] rounded-lg border-2 border-gray-400 px-2'
                    onChange={(e) => setUserIdInput(e.target.value)}
                />
                <button onClick={updateUserId} className='flex justify-center items-center focus:outline-none text-white w-full bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 h-[2.5rem] w-[5rem]'>Update</button>
            </div>
        </div>
    )
}

export default Nav;