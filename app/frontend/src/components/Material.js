import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const MaterialUIForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({ name: false, email: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: false }); // Reset errors on change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {
      name: formData.name.trim() === "",
      email: formData.email.trim() === "" || !/\S+@\S+\.\S+/.test(formData.email),
    };

    if (newErrors.name || newErrors.email) {
      setErrors(newErrors);
      return;
    }

    console.log("Form Submitted", formData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "white",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Material UI Form
      </Typography>

      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        error={errors.name}
        helperText={errors.name ? "Name is required" : ""}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        error={errors.email}
        helperText={errors.email ? "Enter a valid email" : ""}
        sx={{ mb: 2, }}
      />

      <Button variant="contained" color="error" type="submit" fullWidth>
        Submit
      </Button>
    </Box>
  );
};

export default MaterialUIForm;
