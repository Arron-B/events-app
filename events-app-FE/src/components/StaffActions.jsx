import CreateEvent from "./CreateEvent.jsx";

export default function StaffActions ({staffAction, setStaffAction, errorSuccess, setErrorSuccess, submitDisabled, setSubmitDisabled, setOpen, setEventId, setSearchParams, setDisplay, setNewEventPosted, newEventPosted}) {

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
            return <p>hello</p>;
          case 'edit':
            return <p>hello2</p>;
          default:
            return null;
        }
      };

      return (<>{renderComponent()}</>);
}