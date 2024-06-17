import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { startOfToday, format, eachDayOfInterval, startOfMonth, startOfYear, endOfMonth, endOfYear, endOfWeek, startOfWeek, isToday, isSameMonth, isEqual, parse, add, getDay } from "date-fns";


function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const Calendar = ({today, setToday, selectedDay, setSelectedDay}) => {

    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))  
    
    let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())

    const newDays = eachDayOfInterval({
        start: startOfWeek(firstDayCurrentMonth),
        end: endOfWeek(endOfMonth(firstDayCurrentMonth))
    })

    function previousMonth() {
        
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    };

    function nextMonth() {
        
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    };

    const days = [
		{ date: "2021-12-27" },
		{ date: "2021-12-28" },
		{ date: "2021-12-29" },
		{ date: "2021-12-30" },
		{ date: "2021-12-31" },
		{ date: "2022-01-01", isCurrentMonth: true },
		{ date: "2022-01-02", isCurrentMonth: true },
		{ date: "2022-01-03", isCurrentMonth: true },
		{ date: "2022-01-04", isCurrentMonth: true },
		{ date: "2022-01-05", isCurrentMonth: true },
		{ date: "2022-01-06", isCurrentMonth: true },
		{ date: "2022-01-07", isCurrentMonth: true },
		{ date: "2022-01-08", isCurrentMonth: true },
		{ date: "2022-01-09", isCurrentMonth: true },
		{ date: "2022-01-10", isCurrentMonth: true },
		{ date: "2022-01-11", isCurrentMonth: true },
		{ date: "2022-01-12", isCurrentMonth: true, isToday: true },
		{ date: "2022-01-13", isCurrentMonth: true },
		{ date: "2022-01-14", isCurrentMonth: true },
		{ date: "2022-01-15", isCurrentMonth: true },
		{ date: "2022-01-16", isCurrentMonth: true },
		{ date: "2022-01-17", isCurrentMonth: true },
		{ date: "2022-01-18", isCurrentMonth: true },
		{ date: "2022-01-19", isCurrentMonth: true },
		{ date: "2022-01-20", isCurrentMonth: true },
		{ date: "2022-01-21", isCurrentMonth: true, isSelected: true },
		{ date: "2022-01-22", isCurrentMonth: true },
		{ date: "2022-01-23", isCurrentMonth: true },
		{ date: "2022-01-24", isCurrentMonth: true },
		{ date: "2022-01-25", isCurrentMonth: true },
		{ date: "2022-01-26", isCurrentMonth: true },
		{ date: "2022-01-27", isCurrentMonth: true },
		{ date: "2022-01-28", isCurrentMonth: true },
		{ date: "2022-01-29", isCurrentMonth: true },
		{ date: "2022-01-30", isCurrentMonth: true },
		{ date: "2022-01-31", isCurrentMonth: true },
		{ date: "2022-02-01" },
		{ date: "2022-02-02" },
		{ date: "2022-02-03" },
		{ date: "2022-02-04" },
		{ date: "2022-02-05" },
		{ date: "2022-02-06" },
	];

    return (
        <div className="calendar my-auto md:pr-14">
					<div className="flex items-center">
						<h2 className="flex-auto text-sm font-semibold text-gray-900">
							{format(firstDayCurrentMonth, 'MMMM yyyy')}
						</h2>
						<button
                            onClick={previousMonth}
                            disabled={currentMonth === format(today, 'MMM-yyyy')}
							type="button"
							className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
						>
							<span className="sr-only">Previous month</span>
							<ChevronLeftIcon
								className="h-5 w-5"
								aria-hidden="true"
							/>
						</button>
						<button
                            onClick={nextMonth}
							type="button"
							className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
						>
							<span className="sr-only">Next month</span>
							<ChevronRightIcon
								className="h-5 w-5"
								aria-hidden="true"
							/>
						</button>
					</div>
					<div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
                        <div>S</div>
                        <div>M</div>
						<div>T</div>
						<div>W</div>
						<div>T</div>
						<div>F</div>
						<div>S</div>
					</div>
					<div className="mt-2 grid grid-cols-7 text-sm">
						{newDays.map((day, dayIdx) => (
							<div
								key={day.toString()}
								className={classNames(
									dayIdx > 6 && "border-gray-200",
                                    dayIdx === 0 && colStartClasses[getDay(day)],
									"py-2"
								)}
							>
								<button
									type="button"
                                    onClick={() => setSelectedDay(day)}
									className={classNames(
										isEqual(day, selectedDay) && "text-white",
										!isEqual(day, selectedDay) && isToday(day) && "text-indigo-600",
										!isEqual(day, selectedDay) &&
											!isToday(day) &&
											isSameMonth(day, today) &&
											"text-gray-900",
										!isEqual(day, selectedDay) &&
											!isToday(day) &&
											!isSameMonth(day, today) &&
											"text-gray-400",
										isEqual(day, selectedDay) && isToday(day) && "bg-indigo-600",
										isEqual(day, selectedDay) && !isToday(day) && "bg-gray-900",
										!isEqual(day, selectedDay) && "hover:bg-gray-200",
										(isEqual(day, selectedDay) || isToday(day)) && "font-semibold",
										"mx-auto flex h-8 w-8 items-center justify-center rounded-full"
									)}
								>
									<time dateTime={format(day, 'yyyy-MM-dd')}>
										{format(day, 'd')}
									</time>
								</button>
							</div>
						))}
					</div>
				</div>
    )
}

let colStartClasses = [
    "",
    "col-start-2",
    "col-start-3",
    "col-start-4",
    "col-start-5",
    "col-start-6",
    "col-start-7"
]

export default Calendar;