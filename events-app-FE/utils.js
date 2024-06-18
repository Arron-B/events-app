export const dateParse = (date) => new Date(date);

export const pageHandler = (events, page) => {
    const lastEventIndex = (page * 5) -1;
    const firstEventIndex = (page * 5) -5;
    return events.filter((event, i) => i >= firstEventIndex && i <= lastEventIndex
    )
}
