import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/*
  Prompt used for this round (precise, with constraints + verification step):

  "In src/SettingsForm.jsx, build a settings form with three fields: Name
  (text, required, must not be empty or whitespace-only), Email (text,
  required, must be a valid email format), and Email notifications
  (checkbox, defaults to true).

  Constraints:
  - Use react-hook-form + zod for validation (see CLAUDE.md convention).
  - Controlled inputs only, no refs/getElementById.
  - Every input needs a visible <label> tied to it via htmlFor/id.
  - Validation errors must render inline under each field, in an
    aria-live="polite" region, not via alert() or console.log.
  - On successful submit, show a success message in the UI (not an alert),
    and do not clear the form.
  - Handle edge cases: empty name, whitespace-only name, missing '@' in
    email, missing domain in email.

  Verification step: after writing the component, write tests in
  SettingsForm.test.jsx covering the happy path and each edge case above,
  then run them and fix any failures before considering this done."
*/

const settingsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  notifications: z.boolean(),
});

export default function SettingsForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: "",
      email: "",
      notifications: true,
    },
  });

  function onSubmit(data) {
    setSubmitted(true);
    // In a real app this would call an API. Kept intentionally simple
    // for the scope of this drill.
    console.log("Settings saved:", data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" {...register("name")} />
        <div aria-live="polite">
          {errors.name && <span role="alert">{errors.name.message}</span>}
        </div>
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" {...register("email")} />
        <div aria-live="polite">
          {errors.email && <span role="alert">{errors.email.message}</span>}
        </div>
      </div>

      <div>
        <label htmlFor="notifications">
          <input
            id="notifications"
            type="checkbox"
            {...register("notifications")}
          />
          Email notifications
        </label>
      </div>

      <button type="submit">Save</button>

      <div aria-live="polite">
        {submitted && <p>Settings saved successfully.</p>}
      </div>
    </form>
  );
}
