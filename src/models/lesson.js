"use strict";
export default (sequelize, DataTypes) => {
  const Lesson = sequelize.define(
    "Lesson",
    {
      name: {
        primaryKey: true,
        type: DataTypes.STRING
      }
    },
    {
      timestamps: false
    }
  );
  Lesson.associate = function(models) {
    // associations can be defined here
    models.Lesson.belongsToMany(models.User, { through: "UserLessons" });
  };
  return Lesson;
};
