import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const RuleModal = ({ show, handleClose, handleSave }) => {
  const [searchRule, setSearchRule] = useState('');
  const [groupRule, setGroupRule] = useState('');

  const handleSaveRules = () => {
    handleSave(searchRule, groupRule);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Search and Group Rules</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="searchRule">
            <Form.Label>Search Rule</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter search rule"
              value={searchRule}
              onChange={(e) => setSearchRule(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="groupRule">
            <Form.Label>Group Rule</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter group rule"
              value={groupRule}
              onChange={(e) => setGroupRule(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveRules}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RuleModal;
