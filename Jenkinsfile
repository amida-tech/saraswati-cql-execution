pipeline {
    agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    name: saraswati-cql-execution 
spec:
  containers:
  - name: node
    image: node:13.10.1-alpine3.11
    command:
    - cat
    tty: true
"""
    }
  }

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing..'
                sh 'yarn install'
            }
        }
        stage('Build') {
            steps {
                echo 'Building..'
                sh 'yarn build:all'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing?'
                sh 'yarn test'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}