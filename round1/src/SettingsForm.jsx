import { useRef } from "react";

// Prompt used for this round: "make me a settings form"
// (single sentence, no file references, no constraints, no examples)

export default function SettingsForm() {
  const nameRef = useRef();
  const emailRef = useRef();
  const notifRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;

    if (name == "" || email == "") {
      alert("Please fill out all fields");
      return;
    }

    alert("Saved settings for " + name);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input ref={nameRef} placeholder="Name" />
      </div>
      <div>
        <input ref={emailRef} placeholder="Email" />
      </div>
      <div>
        <input ref={notifRef} type="checkbox" />
        Email notifications
      </div>
      <button type="submit">Save</button>
    </form>
  );
}
