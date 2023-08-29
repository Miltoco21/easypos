/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Container,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
} from "@mui/material";

const steps = ["Paso 1", "Paso 2", "Paso 3", "Paso 4", "Paso 5", "Paso 6"];

function MultiStepForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(
    Array.from({ length: steps.length }, () => ({}))
  );
  const [open, setOpen] = useState(false);
  const [inputErrors, setInputErrors] = useState(
    Array.from({ length: steps.length }, () => ({}))
  );

  const handleNext = () => {
    const currentStep = activeStep;
    const currentData = formData[currentStep];
    if (!currentData.input1 || !currentData.input2 || !currentData.input3) {
      setInputErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[currentStep] = {
          input1: !currentData.input1,
          input2: !currentData.input2,
          input3: !currentData.input3,
        };
        return newErrors;
      });
    } else {
      setInputErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[currentStep] = {};
        return newErrors;
      });
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (stepIndex, field, value) => {
    setFormData((prevData) => {
      const newData = [...prevData];
      newData[stepIndex][field] = value;
      return newData;
    });
  };

  const handleSubmit = () => {
    // Validation before submission
    if (
      formData.every(
        (stepData) => stepData.input1 && stepData.input2 && stepData.input3
      )
    ) {
      // Call API endpoint to save formData
      console.log(formData);
      handleClose();
    } else {
      alert("Please fill in all inputs before submitting.");
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
    setFormData(Array.from({ length: steps.length }, () => ({})));
    setInputErrors(Array.from({ length: steps.length }, () => ({})));
  };

  return (
    <Container maxWidth="md">
      <Button variant="contained" color="primary" sx={{marginTop:'13px'}}onClick={handleOpen}>
        Agregar Producto
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <h3 style={{ textAlign: "center" ,marginTop:'5px'}}>Agregar Producto</h3>
        <DialogContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div>
            {activeStep === steps.length ? (
              <div>
                <p>Todo completado y listo para guardar.</p>
                <DialogActions>
                  <Button onClick={handleClose}>Cancelar</Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Guardar
                  </Button>
                </DialogActions>
              </div>
            ) : (
              <div>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Input 1"
                      value={formData[activeStep]?.input1 || ""}
                      onChange={(e) =>
                        handleInputChange(activeStep, "input1", e.target.value)
                      }
                      error={inputErrors[activeStep]?.input1}
                      helperText={
                        inputErrors[activeStep]?.input1 &&
                        "Please fill in this field"
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Input 2"
                      value={formData[activeStep]?.input2 || ""}
                      onChange={(e) =>
                        handleInputChange(activeStep, "input2", e.target.value)
                      }
                      error={inputErrors[activeStep]?.input2}
                      helperText={
                        inputErrors[activeStep]?.input2 &&
                        "Please fill in this field"
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Input 3"
                      value={formData[activeStep]?.input3 || ""}
                      onChange={(e) =>
                        handleInputChange(activeStep, "input3", e.target.value)
                      }
                      error={inputErrors[activeStep]?.input3}
                      helperText={
                        inputErrors[activeStep]?.input3 &&
                        "Please fill in this field"
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <DialogActions>
                  <Button disabled={activeStep === 0} onClick={handleBack}>
                    Volver
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
                  </Button>
                </DialogActions>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default MultiStepForm;
