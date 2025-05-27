// import Modal from "./components/Modal/Modal";
import SignupForm from "./components/SignupForm/SignupForm";

function App(): JSX.Element {
  return (
    <>
      {/* <Modal
        isOpen={true}
        onClose={() => {}}
        title="Signup"
        preventClose={true}
      >
        <p>Welcome to the signup modal!</p>
        <p>Please fill out the form below to sign up.</p>
        <p>We are excited to have you on board!</p>
        <p>Thank you for choosing our service!</p>
        <p>We value your privacy and will keep your information secure.</p>
        <p>If you have any questions, feel free to contact us.</p>
      </Modal> */}

      <SignupForm />
    </>
  );
}

export default App;
