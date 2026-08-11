/**
 * Dynamic configuration object for the user profile modal form.
 * Drives field rendering using the reusable FormData component.
 * Keys align with API profile payload: name, role, school_name, state, district.
 */
export const PROFILE_FORM_SCHEMA = {
  fields: [
    {
      id: "name",
      labelKey: "name",
      labelName: "Name",
      layOut: 1,
      inputType: "text",
      inputName: "name",
      dataKey: "name",
      placeholderKey: "name",
      placeholder: "Name",
    },
    {
      id: "role",
      labelKey: "roleDesignation",
      labelName: "Role / Designation",
      layOut: 1,
      inputType: "text",
      inputName: "role",
      dataKey: "role",
      placeholderKey: "roleDesignation",
      placeholder: "Role / Designation",
    },
    {
      id: "school_name",
      labelKey: "organisationSchool",
      labelName: "Organisation / School",
      layOut: 1,
      inputType: "text",
      inputName: "school_name",
      dataKey: "school_name",
      placeholderKey: "organisationSchool",
      placeholder: "Organisation / School",
    },
    {
      id: "location",
      labelKey: "location",
      labelName: "Location",
      type: "split",
      fields: [
        {
          id: "state",
          labelKey: "state",
          labelName: "State",
          layOut: 1,
          inputType: "text",
          inputName: "state",
          dataKey: "state",
          placeholderKey: "state",
          placeholder: "State",
        },
        {
          id: "district",
          labelKey: "district",
          labelName: "District",
          layOut: 1,
          inputType: "text",
          inputName: "district",
          dataKey: "district",
          placeholderKey: "district",
          placeholder: "District",
        },
      ],
    },
  ],
}

/** Modal-level configuration */
export const PROFILE_MODAL_CONFIG = {
  maxWidth: "480px",
}
