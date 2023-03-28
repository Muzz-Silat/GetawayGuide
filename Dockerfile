# Base image
FROM python:3.11.2

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /Team-Project-Webapp/

# Copy requirements.txt to container
COPY requirements.txt /Team-Project-Webapp/

# Install dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the source code to container
COPY . /Team-Project-Webapp/

# # Run the Django app
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
# Base image
# FROM python:3.11.2

# # Set environment variables
# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1

# # Set working directory
# WORKDIR /Team-Project-Webapp/

# # Copy requirements.txt to container
# COPY requirements.txt /Team-Project-Webapp/

# # Install dependencies
# RUN pip install --upgrade pip && pip install -r requirements.txt

# # Copy the source code to container
# COPY . /Team-Project-Webapp/
    
# RUN python manage.py makemigrations
# RUN python manage.py migrate
