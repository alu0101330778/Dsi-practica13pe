import { Schema, Document, model } from 'mongoose'
import validator from 'validator'

interface CoursesDocumentInterface extends Document {
  title: string,
  description: string,
}

const CoursesSchema = new Schema<CoursesDocumentInterface>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
});

export interface StudentDocumentInterface extends Document {
  id: number,
  name: string,
  apellidos: string,
  edad: number,
  email: string,
  asignaturas: [typeof CoursesSchema],
}

const StudentSchema = new Schema<StudentDocumentInterface>({
id: {
  type:Number,
  required: true,
  unique: true,
  trim: true
},
  name: {
    type: String,
    required: true,
    trim: true
  },
  apellidos: {
    type: String,
    required: true,
    trim: true
  }, 
  edad: {
    type: Number,
    default: 0,
    validate(value: number) {
      if (value < 0) {
        throw new Error('Age must be greater than 0');
      }
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value: string) {
      if (!validator.default.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    }
  },
  asignaturas: { 
  type: [Schema.Types.ObjectId],
  required: true,
  ref: 'Asignatura'
  },
});
export const Course = model<CoursesDocumentInterface>('Asignatura', CoursesSchema);
export const Student = model<StudentDocumentInterface>('Student', StudentSchema);