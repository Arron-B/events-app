import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

function PageButtons({ page, setPage, display }) {
	return (
		<>
			<div className="flex w-full mx-auto justify-center">
				<button
					type="button"
					className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 w-1/3"
					disabled={page <= 1}
					onClick={() => {
						setPage(page - 1)
					}}
				>
					<span className="sr-only">Previous page</span>
					<ChevronLeftIcon
						className="h-5 w-5"
						aria-hidden="true"
					/>
				</button>
				<p className="landscape:md:text-sm">{page}</p>
				<button
					type="button"
					className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 w-1/3"
					disabled={page >= display.length / 5}
					onClick={() => {
						setPage(page + 1)
					}}
				>
					<span className="sr-only">Next page</span>
					<ChevronRightIcon
						className="h-5 w-5"
						aria-hidden="true"
					/>
				</button>
			</div>
		</>
	);
}

export default PageButtons;
