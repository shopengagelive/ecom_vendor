import React from 'react'

type LoaderProps = {
    loadingLabel?: string;
};

const Loader = ({ loadingLabel }: LoaderProps) => {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">{loadingLabel || 'Loading...'}</span>
        </div>
    )
}

export default Loader
