import Box, { BoxProps } from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MenuItem } from "@mui/material";

export default function ServiceSelector(
  props: BoxProps & {
    services: { label: string; service: string }[];
    service: string;
    setService: (service: string) => void;
  }
) {
  const handleChange = (event: SelectChangeEvent) => {
    props.setService(event.target.value as string);
  };

  return (
    <Box sx={props.sx}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">지도</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.service}
          label="지도"
          onChange={handleChange}
        >
          {props.services.map((service, index) => (
            <MenuItem key={index} value={service.service}>
              {service.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
