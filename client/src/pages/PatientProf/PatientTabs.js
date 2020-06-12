/*
	Component that renders tabs for patients, contains all main components and info
	@imported in PatientHomepage
*/
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
// Components
import DoctorsList from "../DoctorProf/DoctorsList";
import PatientDiaryTab from "./PatientDiaryTab";
import PatientRecepiesTab from "./PatientRecepiesTab";
import Calendar from "../Calendar/Calendar";
import Scheduler from "../Calendar/Scheduler";
import { getPatientAppointments } from "../../actions/calendarAction";
import omitEmpty from "omit-empty";
import isEmpty from "../../helpers/isempty";
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}
const styles = theme => ({
});
const defProps = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: []
};
class PatientTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange = (event, value) => {
    this.setState({ value });
  };
  componentDidMount = () => {
    this.props.getPatientAppointments(this.props.auth.user.id);
  };
  render() {
    const { appointments } = this.props;
    const { value } = this.state;
    let content = null;
    if (isEmpty(omitEmpty(appointments))) {
      content = null;
    } else {
      content = appointments;
    }
    //renders the 4 main tabs on the patient side and defaults to showing the `Doctors` tab
    return (
      <div>
        <div className="main-patienttabs">
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={this.handleChange}
              centered>
              <Tab className="main-tabs" label="Doctors" />
              <Tab className="main-tabs" label="E-card" />
              <Tab className="main-tabs" label="Prescriptions" />
              <Tab className="main-tabs" label="Planned Appointments" />
            </Tabs>
          </AppBar>
          {value === 0 && (
            <TabContainer>
              <DoctorsList />
            </TabContainer>
          )}
          {value === 1 && (
            <TabContainer>
              <PatientDiaryTab />
            </TabContainer>
          )}
          {value === 2 && (
            <TabContainer>
              <PatientRecepiesTab />
            </TabContainer>
          )}
          {value === 3 && (
            <TabContainer>
              {content ? (
                <Scheduler appointments={content} />
              ) : (
                  <Calendar appointments={defProps} />
                )}
            </TabContainer>
          )}
        </div>
      </div>
    );
  }
}
PatientTabs.propTypes = {
  auth: PropTypes.object.isRequired,
  appointments: PropTypes.array,
  general: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  appointments: state.appointments,
  general: state.general
});
export default connect(
  mapStateToProps,
  { getPatientAppointments }
)(withStyles(styles)(PatientTabs));