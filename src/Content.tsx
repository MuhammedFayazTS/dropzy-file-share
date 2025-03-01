import { Outlet } from 'react-router'

const Content = () => {
    return (
        <div className="w-full h-[calc(100vh-140px)]">
            <Outlet />
        </div>
    )
}

export default Content