import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedUser } from './userSlice';
import HcsAppBar from '../parts/appBar';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    
}));

export default function UserShow() {
    const classes = useStyles();
    // stateで管理するユーザ詳細データを使用できるようにローカルのselectedUsers定数に格納
    const selectedUsers = useSelector(selectSelectedUser)
    const dispatch = useDispatch()

    return (
        <div>
            
        </div>
    )
}

