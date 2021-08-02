pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing..'
                sh 'npm install'
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
                sh 'npm test'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}