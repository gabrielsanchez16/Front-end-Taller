

const Loading = () => {
    return (
        <div className="fixed inset-0 bg-black opacity-85 flex flex-col items-center justify-center z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-4"></div>
            <p className="text-white text-lg font-semibold">
                Por favor espera...
            </p>
        </div>
    )
}

export default Loading