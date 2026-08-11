/**
 * Dynamic configuration object for the user profile modal form.
 * Drives field rendering using the reusable FormData component.
 * Keys align with API profile payload: name, role, school_name, state, district.
 */
export const PROFILE_FORM_SCHEMA = {
  fields: [
    {
      id: "name",
      labelName: "name",
      inputType: "text",
      placeholder: "name",
    },
    {
      id: "role",
      labelName: "roleDesignation",
      inputType: "text",
      placeholder: "roleDesignation",
    },
    {
      id: "school_name",
      labelName: "organisationSchool",
      inputType: "text",
      placeholder: "organisationSchool",
    },
    {
      id: "location",
      labelName: "location",
      type: "split",
      fields: [
        {
          id: "state",
          labelName: "stateText",
          inputType: "text",
          placeholder: "stateText",
        },
        {
          id: "district",
          labelName: "district",
          inputType: "text",
          placeholder: "district",
        },
      ],
    },
  ],
}

/** Modal-level configuration */
export const PROFILE_MODAL_CONFIG = {
  maxWidth: "480px",
}
