import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { SSession, SessionSchema } from '../../api/session/session.js';
import { Profile } from '../../api/profile/profile.js';

/* eslint-disable object-shorthand, no-unused-vars */

const displayErrorMessages = 'displayErrorMessages';

Template.Session_Page.onCreated(function onCreated() {
  this.autorun(() => {
    this.subscribe('SSession');
  });
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displayErrorMessages, false);
  this.context = SessionSchema.namedContext('Session_Page');
  this.autorun(() => {
    this.subscribe('Profile');
  });
});


Template.Session_Page.helpers({
  sessionField(fieldName) {
    // change it later
    const session = SSession.findOne(FlowRouter.getParam('_id'));
    // See https://dweldon.silvrback.com/guards to understand '&&' in next line.
    return session && session[fieldName];
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  displayFieldError(fieldName) {
    const errorKeys = Template.instance().context.invalidKeys();
    return _.find(errorKeys, (keyObj) => keyObj.name === fieldName);
  },
  profileField(fieldName) {
    // change it later
    const profile = Profile.findOne(FlowRouter.getParam('_id'));
    // See https://dweldon.silvrback.com/guards to understand '&&' in next line.
    return profile && profile[fieldName];
  },
  profileList() {
    return Profile.find();
  },
  profileShow: function (field) {
    const session = SSession.findOne(FlowRouter.getParam('_id'));
    const owner = session.owner;
    if (field === owner) {
      return true;
    }
    return false;
  },
  profileShowS: function (field) {
    const session = SSession.findOne(FlowRouter.getParam('_id'));
    const student = session.students;
    if (field === student) {
      return true;
    }
    return false;
  },
});

// Template.Edit_Contact_Page.onRendered(function enableSemantic() {
//   const template = this;
//   template.subscribe('StudentData', () => {
//     // Use this template.subscribe callback to guarantee that the following code executes after subscriptions OK.
//     Tracker.afterFlush(() => {
//       // Use Tracker.afterFlush to guarantee that the DOM is re-rendered before calling JQuery.
//       template.$('select.ui.dropdown').dropdown();
//       template.$('.ui.selection.dropdown').dropdown();
//       template.$('select.dropdown').dropdown();
//       template.$('.ui.checkbox').checkbox();
//       template.$('.ui.radio.checkbox').checkbox();
//     });
//   });
// });

Template.Session_Page.events({
  'click .delete'(event, instance) {
    event.preventDefault();
    const r = window.confirm('Do you really want to delete this entry?');
    if (r === true) {
      SSession.remove(FlowRouter.getParam('_id'));
      FlowRouter.go('Home_Page');
    } else {
      FlowRouter.go('Home_Page');
    }
  },
  'click .going'(event, instance) {
    event.preventDefault();
    // Get name (text field)
    // const first = event.target.first.value;
    // const last = event.target.last.value;
    // const preCourse = event.target.preCourse.value;
    // const currCourse = event.target.currCourse.value;
    // const description = event.target.description.value;
    const student = Meteor.userId();
    // const updateProfile = { first, last, preCourse, currCourse, description, students };
    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that newStudentData reflects what will be inserted.
    // SessionSchema.clean(updateProfile);
    // Determine validity.
    // instance.context.validate(updateProfile);
    // if (instance.context.isValid()) {
    SSession.update(FlowRouter.getParam('_id'), { $set: { students: student } });
    instance.messageFlags.set(displayErrorMessages, false);
    window.alert('You are added!');
    // FlowRouter.go('List_Session_Page');
    // } else {
    //   instance.messageFlags.set(displayErrorMessages, true);
    // }
  },
});

