import React, { Fragment, FC, useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import * as yup from 'yup';
import Dragger from 'antd/lib/upload/Dragger';
import { FileOutlined } from '@ant-design/icons';
import { Message } from 'helpers/Message';
import { showWarningMessage, showConfirmMessage } from 'helpers/Swal.module';
import { useStorage } from 'hook/useStorage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import 'styles/scss/ModalWorkExperience.scss';
import { useFormik } from 'formik';

interface IStep3 {
  isShow: boolean;
  onHide: () => void;
  userProfile: ENTITIES.UserProfile;
  uploadFileStep3: (file: File) => void;
  updateUserProfile: (newUserProfile: ENTITIES.UserProfile) => void;
}

const schema = yup.object().shape({
  step_3: yup
    .number()
    .typeError('Score must be a number')
    .min(0)
    .max(1000, 'Score  must be less than or equal to 1000')
    .required('Score  is a required field'),
  step_3_document_name: yup.string().required('Please upload your document'),
  is_passed_step3: yup.boolean().required('Please choose passed or failed'),
});
interface IStep3Form {
  step_3: number;
  step_3_document_name: string;
  is_passed_step3: boolean;
}
const initialValues: IStep3Form = {
  step_3: 0,
  step_3_document_name: '',
  is_passed_step3: false,
};

export const Step3Modal: FC<IStep3> = props => {
  const {
    isShow,
    onHide,
    uploadFileStep3,
    userProfile,
    updateUserProfile,
  } = props;

  useEffect(() => {
    setErrors({});
    if (isShow === true) {
      setFieldValue('step_3_document_name', userProfile.step_3_document_name);
      setFieldValue('step_3', userProfile.step_3);
      setFieldValue('is_passed_step3', userProfile.is_passed_step3);
    }
  }, [userProfile, isShow]);

  const {
    handleSubmit,
    handleChange,
    values,
    errors,
    touched,
    setFieldValue,
    setErrors,
  } = useFormik({
    initialValues: {
      ...initialValues,
    },
    validationSchema: schema,
    onSubmit: async values => {
      const isUpdate = await showConfirmMessage(
        Message.Update_Question,
        '',
        'warning',
      );
      if (isUpdate.value === true) {
        updateUserProfile({
          ...userProfile,
          step_3: values.step_3,
          step_3_document_name: values.step_3_document_name,
          is_passed_step3: values.is_passed_step3,
        });
        onHide();
      }
    },
  });

  const url_file = useStorage(
    `files/${userProfile.email}/Step3/${values.step_3_document_name}`,
  );

  const beforeUpload = (file: File) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      showWarningMessage(Message.Size_File_Too_Big);
    } else {
      setFieldValue('step_3_document_name', file.name);
      uploadFileStep3(file);
    }
    return false;
  };

  return (
    <Fragment>
      <Modal backdrop="static" show={isShow} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Step 3</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Score</label>
              <input
                name="step_3"
                type="number"
                value={values.step_3}
                className="form-control"
                id="exampleInputEmail1"
                placeholder="Enter your Score"
                onChange={handleChange}
              />
              {touched.step_3 && errors.step_3 && (
                <span className={'text-danger'}>{errors.step_3}</span>
              )}
            </div>
            <div className="form-group">
              <div className="radio radio-box-inline">
                <label>
                  <input
                    type="radio"
                    name="is_passed_step3"
                    checked={values.is_passed_step3 === true}
                    onChange={() => setFieldValue('is_passed_step3', true)}
                  />
                  Pass
                </label>
              </div>
              <div className="radio radio-box-inline">
                <label>
                  <input
                    type="radio"
                    name="is_passed_step3"
                    checked={values.is_passed_step3 === false}
                    onChange={() => setFieldValue('is_passed_step3', false)}
                  />
                  Fail
                </label>
              </div>
            </div>
            <div className="form-group">
              <div className="upload-file">
                <Dragger beforeUpload={beforeUpload} showUploadList={false}>
                  <p className="ant-upload-drag-icon">
                    <FileOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload your document
                  </p>
                </Dragger>
                {values.step_3_document_name && (
                  <div className="file-name-link">
                    <a target="_blank" href={url_file}>
                      {values.step_3_document_name}
                    </a>
                    <a
                      onClick={e => {
                        e.preventDefault();
                        setFieldValue('step_3_document_name', '');
                      }}
                      href="#"
                    >
                      <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                    </a>
                  </div>
                )}

                <input
                  type="text"
                  value={values.step_3_document_name}
                  name="step_3_document_name"
                  onChange={handleChange}
                  hidden
                />
                {touched.step_3_document_name &&
                  errors.step_3_document_name && (
                    <span className={'text-danger'}>
                      {errors.step_3_document_name}
                    </span>
                  )}
              </div>
            </div>
            <div className="text-right mt-2">
              <button
                type="submit"
                className="btn btn-success btn-save-profile"
              >
                Save
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};