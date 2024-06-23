import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { startOfToday, format, eachDayOfInterval, startOfMonth, startOfYear, endOfMonth, endOfYear, endOfWeek, startOfWeek, isToday, isSameMonth, isEqual, parse, add, getDay, isSameDay } from "date-fns";


function classNames(...classes) {
	return "relative " + classes.filter(Boolean).join(" ");
}

const Calendar = ({today, selectedDay, setSelectedDay, upcomingEvents, setDisplay, setPage, setPrevDisplay}) => {

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

    return (
        <div className="calendar my-auto landscape:md:pr-14 portrait:relative">
					<div className="flex items-center">
						<h2 className="flex-auto text-sm font-semibold text-gray-900">
							{format(firstDayCurrentMonth, 'MMMM yyyy')}
						</h2>
						<button
                            onClick={previousMonth}
                            disabled={currentMonth === format(today, 'MMM-yyyy')}
							type="button"
							className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400
                             hover:text-gray-500 portrait:absolute portrait:-left-6 portrait:top-0 portrait:h-full"
						>
							<span className="sr-only">Previous month</span>
							<ChevronLeftIcon
								className="h-5 w-5 portrait:h-full portrait:w-10"
								aria-hidden="true"
							/>
						</button>
						<button
                            onClick={nextMonth}
							type="button"
							className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 portrait:absolute portrait:-right-6 portrait:top-0 portrait:h-full"
						>
							<span className="sr-only">Next month</span>
							<ChevronRightIcon
								className="h-5 w-5 portrait:h-full portrait:w-10"
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
                                    onClick={() => {
                                        setSelectedDay(day)
										setPage(1)
                                        const dayEvents = upcomingEvents.filter((event) => isSameDay(event.datetime, day))
                                        setDisplay(dayEvents)
										setPrevDisplay(dayEvents)
                                    }}
									className={classNames(
										isEqual(day, selectedDay) && "text-white",
										!isEqual(day, selectedDay) && isToday(day) && "text-indigo-500",
										!isEqual(day, selectedDay) &&
											!isToday(day) &&
											isSameMonth(day, today) &&
											"text-gray-900",
										!isEqual(day, selectedDay) &&
											!isToday(day) &&
											format(day, "MMM-yyyy") !== currentMonth &&
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
                                        <p className={`absolute text-[0.6rem] -right-1 -top-2 text-green-700 ${day === selectedDay ? "hidden" : ""}`}>
                                            {upcomingEvents.filter((event) => isSameDay(event.datetime, day)).length > 0 ? upcomingEvents.filter((event) => isSameDay(event.datetime, day)).length : "" }
                                            </p>
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