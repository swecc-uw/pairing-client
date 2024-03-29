import { useEffect, useState } from 'react';
import styled from 'styled-components';
import TimeSelector from './TimeSelector';
import { hntotime, timetohn, getNextMonday } from '../utils/time';
import { FormStepProps } from '../types';

// Styled components
const Container = styled.div`
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  title: "Enter Availability";
`;

const OptionsContainer = styled.div`
  margin-bottom: 20px;
`;

const OptionRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
`;

const TimeLabel = styled.label`
  margin-bottom: 10px;
`;

const TimeDrop = styled.select`
  background: transparent;
  border: none;
  width: 80%;
  max-width: 400px;
  min-width: 100px;
  margin: 0 auto;
  margin-bottom: 20px;
  font-size: larger;
  padding: 5px;
`;

const SaveButton = styled.button`
  margin-bottom: 40px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const UnsavedChangesWarning = styled.div`
  margin-top: 20px;
  font-size: .5em;
  color: lightcoral;
`;

interface AvailabilityProps extends FormStepProps {
  uid: string | undefined;
}


const Availability = ({ nextStep, prevStep, uid }: AvailabilityProps) => {
  const [startTime, setStartTime] = useState(7);
  const [endTime, setEndTime] = useState(17);
  const [availability, setAvailability] = useState<boolean[][]>([]);
  const [changedSinceSave, setChangedSinceSave] = useState(false);
  const numDays = 7;
  const today = new Date();
  const nextMonday = getNextMonday(today);

  useEffect(() => {
    if (!uid)
      prevStep();

    const availabilityString = localStorage.getItem(`availability-${uid}`);
    if (availabilityString) {
      setAvailability(JSON.parse(availabilityString).map((day: number[]) => day.map(hour => hour === 1)));
    } else {
      setAvailability(Array.from({ length: numDays }, () => Array(24).fill(false)));
    }

    setChangedSinceSave(false);
  }, []);

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const t: string = e.target.value;
    setStartTime(timetohn(t));
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const t: string = e.target.value;
    setEndTime(timetohn(t));
  };

  const handleSave = () => {
    if (!uid)
      return;
    localStorage.setItem(`availability-${uid}`, JSON.stringify(availability.map(day => day.map(hour => hour ? 1 : 0))));
    setChangedSinceSave(false);
  };

  const renderOptions = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <OptionsContainer>
        <OptionRow>
          <TimeLabel>Start Time:</TimeLabel>
          <TimeDrop value={hntotime(startTime)} onChange={handleStartTimeChange}>
            {hours.map(hour => (
              <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>
            ))}
          </TimeDrop>
        </OptionRow>
        <OptionRow>
          <TimeLabel>End Time:</TimeLabel>
          <TimeDrop value={hntotime(endTime)} onChange={handleEndTimeChange}>
            {hours.map(hour => (
              <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>
            ))}
          </TimeDrop>
        </OptionRow>
      </OptionsContainer>
    );
  };

  const setAvailabilityWrapper = (availability: boolean[][]) => {
    setChangedSinceSave(true);
    setAvailability(availability);
  }


  return (
    <Container>
      <Title>Enter Availability</Title>
      <TimeSelector
        startDate={nextMonday}
        numDays={numDays}
        startTime={startTime}
        endTime={endTime}
        availability={availability}
        setAvailability={setAvailabilityWrapper}
      />
      {renderOptions()}

      <div>
        {changedSinceSave && <UnsavedChangesWarning>Unsaved changes</UnsavedChangesWarning>}
        <SaveButton onClick={handleSave}>Save</SaveButton>
      </div>
      <ButtonsContainer>
        <button onClick={prevStep}>Previous</button>
        <button onClick={nextStep}>Next</button>
      </ButtonsContainer>
    </Container>
  );
};

export default Availability;
