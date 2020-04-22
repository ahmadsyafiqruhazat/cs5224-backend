"use strict";
export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      role: DataTypes.STRING,
      displayName: DataTypes.STRING,
      photoURL: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      gender: DataTypes.STRING,
      about: DataTypes.STRING,
      dob: DataTypes.DATE,
      languages_known: DataTypes.STRING
    },
    {}
  );
  User.associate = function(models) {
    // associations can be defined here
    models.User.belongsToMany(models.Lesson, { through: "UserLessons" });
    models.User.hasMany(models.Event);
  };
  return User;
};
