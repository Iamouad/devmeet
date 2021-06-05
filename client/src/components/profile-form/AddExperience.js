import React, {Fragment, useState} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { addExperience } from './../../actions/profile';
import { Link, withRouter } from 'react-router-dom';

const AddExperience = ({addExperience, history}) => {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        from: '',
        to: '',
        current: false,
        description: ''
    })

    const [toDateDisabled, toggleDiabled] = useState(false);
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = formData;

    const onChange = e => setFormData({...formData, [e.target.name] : e.target.value})

    return (
        <Fragment>
           <h1 className="large text-primary">
       Add An Experience
      </h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> Add any developer/programming
        positions that you have had in the past
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={e => {
          e.preventDefault();
          addExperience(formData, history)
      }}>
        <div className="form-group">
          <input value={title} onChange={e => onChange(e)} type="text" placeholder="* Job Title" name="title" required />
        </div>
        <div className="form-group">
          <input value={company} onChange={e => onChange(e)} type="text" placeholder="* Company" name="company" required />
        </div>
        <div className="form-group">
          <input value={location} onChange={e => onChange(e)} type="text" placeholder="Location" name="location" />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input value={from} onChange={e => onChange(e)} type="date" name="from" />
        </div>
         <div className="form-group">
          <p><input value={current} checked={current}  type="checkbox" name="current" onChange={e => {
              setFormData({...formData, current: !current});
              toggleDiabled(!toDateDisabled)
          }} /> {' '}Current Job</p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input value={to} onChange={e => onChange(e)} type="date" name="to" disabled={toDateDisabled ? 'disabled': '' } />
        </div>
        <div className="form-group">
          <textarea
            value={description} onChange={e => onChange(e)} 
            name="description"
            cols="30"
            rows="5"
            placeholder="Job Description"
          ></textarea>
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
      </form> 
        </Fragment>
    )
}

AddExperience.propTypes = {
    addExperience: PropTypes.func.isRequired,
}

export default connect(null, {addExperience}) (AddExperience)
