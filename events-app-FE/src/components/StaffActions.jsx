import CreateEvent from "./CreateEvent.jsx";
import EditEvent from "./EditEvent.jsx";
import DeleteEvent from "./DeleteEvent.jsx";

export default function StaffActions ({staffAction, setStaffAction, errorSuccess, setErrorSuccess, submitDisabled, setSubmitDisabled, setOpen, setEventId, setSearchParams, setDisplay, setNewEventPosted, newEventPosted, manipulateEventId, setManipulateEventId}) {

    const renderComponent = () => {
        switch (staffAction) {
          case 'create':
            return <CreateEvent
                        errorSuccess={errorSuccess}
                        setErrorSuccess={setErrorSuccess}
                        submitDisabled={submitDisabled}
						setSubmitDisabled={setSubmitDisabled}
						setOpen={setOpen}
						setEventId={setEventId}
						setSearchParams={setSearchParams}
    					setDisplay={setDisplay}
                        setNewEventPosted={setNewEventPosted}
                        newEventPosted={newEventPosted} />;
          case 'delete':
            return <DeleteEvent
                        manipulateEventId={manipulateEventId}
                        setManipulateEventId={setManipulateEventId}
                        errorSuccess={errorSuccess}
                        setErrorSuccess={setErrorSuccess}
                        submitDisabled={submitDisabled}
						setSubmitDisabled={setSubmitDisabled}
						setOpen={setOpen}
                        setNewEventPosted={setNewEventPosted}
						newEventPosted={newEventPosted}
            />;
          case 'edit':
            return <EditEvent
                        manipulateEventId={manipulateEventId}
                        setManipulateEventId={setManipulateEventId}
                        errorSuccess={errorSuccess}
                        setErrorSuccess={setErrorSuccess}
                        submitDisabled={submitDisabled}
						setSubmitDisabled={setSubmitDisabled}
						setOpen={setOpen}
                        setNewEventPosted={setNewEventPosted}
						newEventPosted={newEventPosted}
                        setSearchParams={setSearchParams}
                        setEventId={setEventId}
            />;
          default:
            return null;
        }
      };

      return (<>{renderComponent()}</>);
}