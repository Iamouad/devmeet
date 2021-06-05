import React, {Fragment, useState} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { addEducation } from './../../actions/profile';
import { Link, withRouter } from 'react-router-dom';

const AddEducation = ({addEducation, history}) => {
    const [formData, setFormData] = useState({
        school: '',
        degree: '',
        fieldofstudy: '',
        from: '',
        to: '',
        description: '',
        current: false
    })

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        description,
        current
    } = formData;

    const onChange = e => setFormData({...formData, [e.target.name] : e.target.value})

    return (
        <Fragment>
           <h1 className="large text-primary">
       Add An Education
      </h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> Add any school, bootcamp, etc that
        you have attended
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={e => {
          e.preventDefault();
          addEducation(formData, history)
      }}>
        <div class="form-group">
          <input
            type="text"
            placeholder="* School or Bootcamp"
            name="school"
            value={school}
            onChange={(e) => onChange(e) }
            required
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            placeholder="* Degree or Certificate"
            name="degree"
            required
            value={degree}
            onChange={(e) => onChange(e) }
          />
        </div>
        <div class="form-group">
          <input type="text" placeholder="Field Of Study" onChange={(e) => onChange(e) } name="fieldofstudy" value={fieldofstudy} />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input value={from} onChange={e => onChange(e)} type="date" name="from" />
        </div>
         <div className="form-group">
          <p><input value={current} checked={current}  type="checkbox" name="current" onChange={e => {
              setFormData({...formData, current: !current});
          }} /> {' '}Current School</p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input value={to} onChange={e => onChange(e)} type="date" name="to" />
        </div>
        <div className="form-group">
          <textarea
            value={description} onChange={e => onChange(e)} 
            name="description"
            cols="30"
            rows="5"
            placeholder="Program Description"
          ></textarea>
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
      </form> 
        </Fragment>
    )
}

AddEducation.propTypes = {
    addEducation: PropTypes.func.isRequired,
}

export default connect(null, {addEducation}) (AddEducation)
