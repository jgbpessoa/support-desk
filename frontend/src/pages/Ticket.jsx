import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTicket, closeTicket } from "../features/tickets/ticketSlice";
import {
  getNotes,
  addNote,
  reset as notesReset,
} from "../features/notes/noteSlice";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import NoteItem from "../components/NoteItem";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";

const customStyles = {
  content: {
    width: "80%",
    maxWidth: "600px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    position: "relative",
  },
};

Modal.setAppElement("#root");

function Ticket() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const { ticket, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.tickets
  );

  const { notes, isLoading: notesIsLoading } = useSelector(
    (state) => state.notes
  );

  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const ticketId = params.ticketId;

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(getTicket(ticketId));
    dispatch(getNotes(ticketId));
  }, [dispatch, ticketId, isError, message]);

  if (isError) {
    return <h3>Something Went Wrong...</h3>;
  }

  // Close ticket
  const onTicketClose = () => {
    dispatch(closeTicket(ticketId));
    toast.success("Ticket Closed");
    navigate("/tickets");
  };

  // Open/close Modal
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // Create note submit
  const onNoteSubmit = (e) => {
    e.preventDefault();
    console.log("Submit");
    dispatch(addNote({ noteText, ticketId }));
    setNoteText("");
    closeModal();
  };

  return (
    <div className="ticket-page">
      <header className="ticket-header">
        <BackButton url="/tickets" />
        {isLoading || notesIsLoading ? (
          <Spinner />
        ) : (
          <>
            <h2>
              Ticket ID: {ticket._id}
              <span className={`status status-${ticket.status}`}>
                {ticket.status}
              </span>
            </h2>
            <h3>
              Date Submitted:{" "}
              {new Date(ticket.createdAt).toLocaleString("en-US")}
            </h3>
            <h3>Product: {ticket.product}</h3>
            <hr />
            <div className="ticket-desc">
              <h3>Description of Issue</h3>
              <p>{ticket.description}</p>
            </div>
            <h2>Notes</h2>
            {ticket.status !== "closed" && (
              <button onClick={openModal} className="btn">
                <FaPlus />
                Add Note
              </button>
            )}
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Add Note"
            >
              <h2>Add Note</h2>
              <button className="btn-close" onClick={closeModal}>
                X
              </button>
              <form onSubmit={onNoteSubmit}>
                <div className="form-group">
                  <textarea
                    name="noteText"
                    id="noteText"
                    className="form-control"
                    placeholder="Note text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                  ></textarea>
                </div>
                <div className="form-group">
                  <button className="btn" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </Modal>
            {notes.length === 0 && (
              <div className="note">
                <p>You have not sent/received any note.</p>
              </div>
            )}
            {notes.map((note) => (
              <NoteItem key={note._id} note={note} />
            ))}
            {ticket.status !== "closed" && (
              <button
                className="btn btn-block btn-danger"
                onClick={onTicketClose}
              >
                Close Ticket
              </button>
            )}
          </>
        )}
      </header>
    </div>
  );
}

export default Ticket;
