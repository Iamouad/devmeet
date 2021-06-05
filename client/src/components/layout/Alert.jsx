import React from 'react';
import { useSelector, connect } from 'react-redux';

//props.alerts
export const Alert = () =>{

    const alerts = useSelector(state => state.alert);
    //console.log(alerts);
    return (alerts !== null && alerts.length > 0 && alerts.map(
        alert => (
            <div key={alert.id} className={'alert alert-'+alert.alertType}>
                {alert.msg}
            </div>
            )
    ));}

const mapStateToProps = state =>({
    alerts: state.alert
    })

export default connect(mapStateToProps) (Alert);