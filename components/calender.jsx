import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const localizer = momentLocalizer(moment);

const MyCalendar = ({ username }) => {
    const [events, setEvents] = useState([]);
    const [currentEvent, setCurrentEvent] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [editEvent, setEditEvent] = useState(null);
    const [dangerAlert, setDangerAlert] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        start: '',
        end: '',
        backgroundColor: '#3788d8',
        description: '',
    });

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [viewEventDetailsModel, setViewEventDetailsModel] = useState(false)

    const fetchEvents = async () => {
        try {
            const res = await axios.get('/api/events');
            setEvents(res?.data?.events);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleSelect = ({ start }) => {
        setShowModal(true);
        setEditEvent(null);
        const clickedDate = new Date(start);
        const endDate = new Date(clickedDate);
        endDate.setDate(endDate.getDate() + 1);

        const defaultFormData = {
            title: '',
            start: moment(clickedDate).format('YYYY-MM-DD'),
            end: moment(endDate).format('YYYY-MM-DD'),
            backgroundColor: '#3788d8',
            description: '',
        };

        setEditEvent(null);
        setFormData(defaultFormData);
    };


    const handelViewEvent = (e) => {
        setCurrentEvent(e)
        setViewEventDetailsModel(true)
    }

    const handleEdit = (event) => {
        // Check if username is set before allowing edit
        if (username) {
            setShowModal(true);
            setEditEvent(event);

            const { _id, title, start, end, backgroundColor, description } = event;
            const editFormData = {
                id: _id,
                title,
                start: moment(start).format('YYYY-MM-DD'),
                end: moment(end).format('YYYY-MM-DD'),
                backgroundColor,
                description: description || '',
            };

            setFormData(editFormData);
        } else {
            // Username is not set, do not allow edit
            setErrorMessage('You do not have permission to edit events.');
            setDangerAlert(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditEvent(null);
        setFormData({
            title: '',
            start: '',
            end: '',
            backgroundColor: '#3788d8',
            description: '',
        });
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSubmit = async (data) => {
        setLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
            if (data.end <= data.start) {
                setDangerAlert(true);
                setErrorMessage('End date should be greater than start date.');
                setLoading(false);
                return;
            }

            setDangerAlert(false);

            const eventData = {
                title: data.title,
                start: data.start,
                end: data.end,
                backgroundColor: data.backgroundColor,
                description: data.description || '',
            };

            // Fetch existing events to check the count on the same date
            const response = await axios.get('/api/events');

            if (editEvent) {
                await axios.post('/api/events', { ...eventData, eventId: editEvent._id });
            } else {
                const existingEventsOnDate = response.data.events.filter((event) => event.start === data.start);

                if (existingEventsOnDate.length >= 2) {
                    setErrorMessage('Cannot add more than 2 events to the same date.');
                    setLoading(false);
                    return;
                }

                await axios.post('/api/events', eventData);
            }

            fetchEvents();
            setSuccessMessage(editEvent ? 'Event updated successfully' : 'Event added successfully');
            setLoading(false);
            setShowModal(false);
        } catch (error) {
            console.error('Error submitting event:', error);
            setErrorMessage('An error occurred while submitting the event. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div>
            <Alert
                variant="danger"
                show={dangerAlert}
                onClose={() => setDangerAlert(false)}
                dismissible
            >
                {errorMessage || 'End date should be greater than start date.'}
            </Alert>
            {loading && <p>Loading...</p>}
            {successMessage && (
                <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
                    {successMessage}
                </Alert>
            )}
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 700 }}
                selectable
                onSelectSlot={username ? handleSelect : null}
                onSelectEvent={username ? handleEdit : handelViewEvent}
                eventPropGetter={(event) => ({
                    style: {
                        backgroundColor: event.backgroundColor,
                    },
                })}
                onEventDrop={(event) => console.log('Event dropped:', event)}
                views={['month']}
            />
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editEvent ? 'Edit Event' : 'Add Event'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData.entries());
                            handleSubmit(data);
                        }}
                    >
                        <Form.Group controlId="formEventTitle">
                            <Form.Label>Event Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                defaultValue={formData.title}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formStartDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="start"
                                defaultValue={formData.start}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formEndDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="end"
                                defaultValue={formData.end}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEventDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                rows={3}
                                defaultValue={formData.description}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEventColor">
                            <Form.Label>Color</Form.Label>
                            <Form.Control
                                type="color"
                                name="backgroundColor"
                                defaultValue={formData.backgroundColor}
                            />
                        </Form.Group>

                        {/* Conditionally render the button based on the username */}
                        {username && (
                            <Button variant="primary" type="submit">
                                {editEvent ? 'Save Changes' : 'Add Event'}
                            </Button>
                        )}
                    </Form>
                </Modal.Body>
            </Modal>


            <Modal show={viewEventDetailsModel} onHide={setViewEventDetailsModel}>
                <Modal.Header closeButton>
                    <Modal.Title>{'View Event Details !'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h2>{currentEvent?.title}</h2>
                    <h5>Event - From {moment(currentEvent?.start).format('DD-MM-YYYY')} To {moment(currentEvent?.end).format('DD-MM-YYYY')}</h5>
                    <p>{currentEvent?.description}</p>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default MyCalendar;
