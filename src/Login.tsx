import { createColumn, createFilterBehavior, FilterOperation } from "@euxdt/grid-core";
import { createDateFilterOptions, createNumericRangeFilterOptions, createTextInputFilterOptions, ReactDataGrid } from "@euxdt/grid-react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import { materialAdapter } from "./material-adapter";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function SignIn() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
      <ReactDataGrid
      style={{ height: "800px", width: "600px" }}
      gridOptions={{
        adapter: materialAdapter,
        behaviors:[createFilterBehavior({})],
        dataProvider: [
          {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            age: 30,
            birthDate: new Date(1980, 1, 1),
          },
          {
            id: 2,
            firstName: "Jane",
            lastName: "Doe",
            age: 25,
            birthDate: new Date(1985, 1, 1),
          },
        ],
        uniqueIdentifierOptions: {
          useField: "id",
        },
        columns: [

          {
            ...createColumn("birthDate", "date", "Birth Date"),
            filterOptions: createDateFilterOptions(),
          },
          {
            ...createColumn("id", "number", "ID"),
            filterOptions:createTextInputFilterOptions(FilterOperation.Equals),
          },
          {
            ...createColumn("firstName", "string", "First Name"),
            filterOptions:{
              ...createTextInputFilterOptions(FilterOperation.Wildcard),
              filterWaterMark: "a*, *a, *a*"
            }
          },
          createColumn("lastName", "string", "Last Name"),
          {
            ...createColumn("age", "number", "Age"),
            filterOptions: createNumericRangeFilterOptions(),
          },
        ],
      }}
    ></ReactDataGrid>
      </div>
    </Container>
  );
}
