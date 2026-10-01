import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName) {
      newErrors.name = 'Name is required';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    } else if (trimmedName.length > 50) {
      newErrors.name = 'Name must be less than 50 characters long';
    }

    if (!trimmedEmail) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { data } = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      login(data.data.user, data.data.token);
      toast.success('Account created successfully!');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const responseData = error.response?.data;
      if (responseData?.errors && Array.isArray(responseData.errors)) {
        const fieldErrors = {};
        responseData.errors.forEach((err) => {
          if (err.field) {
            fieldErrors[err.field] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error('Please correct the highlighted fields.');
      } else if (
        error.response?.status === 409 ||
        responseData?.message?.toLowerCase().includes('already exists')
      ) {
        const message = responseData?.message || 'User with this email already exists.';
        setErrors((prev) => ({ ...prev, email: message }));
        toast.error(message);
      } else {
        const message =
          responseData?.message || 'Registration failed. Please try again.';
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormInput
          id="name"
          label="Name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="John Doe"
          autoComplete="name"
        />

        <FormInput
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
        />

        <FormInput
          id="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="At least 6 characters"
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-6 bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium py-2.5 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
        >
          {submitting ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
    </AuthLayout>
  );
}
