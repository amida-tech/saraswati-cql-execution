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
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    imagePullPolicy: Always
    command:
    - /busybox/cat
    tty: true
    volumeMounts:
      - name: jenkins-docker-cfg
        mountPath: /kaniko/.docker
  volumes:
  - name: jenkins-docker-cfg
    projected:
      sources:
      - secret:
          name: mh-docker-hub
          items:
            - key: config.json
              path: config.json
"""
        }
    }
    environment {
        JENKINS=true
        KAFKA_BROKERS="localhost:9092"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing..'
                container('node') {
                    sh 'apk add openjdk11'
                    sh 'yarn install'
                }
            }
        }
        stage('Build') {
            steps {
                echo 'Building..'
                container('node') {
                    sh 'yarn build:all'
                }
            }
        }
        stage('Test') {
            steps {
                echo 'Testing'
                container('node') {
                    checkout(
                        [
                            $class: 'GitSCM', 
                            branches: [
                                [name: '*/develop']
                            ], 
                            extensions: [
                                [
                                    $class: 'RelativeTargetDirectory', 
                                    relativeTargetDir: 'ncqa-cql'
                                ]
                            ], 
                            userRemoteConfigs: [
                                [
                                    credentialsId: 'KEITH-GITHUB', 
                                    url: 'https://github.com/amida-tech/ncqa-cql.git'
                                ]
                            ]
                        ]
                    )

                    sh 'mkdir private'
                    sh 'cd ncqa-cql'
                    sh 'cp -a private/. ../private'
                    sh 'cd ../'
                    sh 'yarn test:jenkins'

                    publishCoverage adapters: 
                        [
                            istanbulCoberturaAdapter(
                                path: 'coverage/cobertura-coverage.xml', 
                                thresholds: [
                                    [
                                        thresholdTarget: 'Line', 
                                        unhealthyThreshold: 90.0, 
                                        unstableThreshold: 85.0
                                    ]
                                ]
                            )
                        ], 
                        sourceFileResolver: sourceFiles('NEVER_STORE')
                }
            }
        }
        stage('Build Production with Kaniko') {
            when { 
                expression {env.GIT_BRANCH == 'master'} 
            }
            steps {
                container(name: 'kaniko', shell: '/busybox/sh') {
                sh '''#!/busybox/sh
                    /kaniko/executor --context `pwd` --verbosity debug --destination=amidatech/saraswati-cql-execution:latest
                '''
                }
            }
        }
        stage('Build Develop with Kaniko') {
            when { 
                expression {env.GIT_BRANCH == 'develop'} 
            }
            steps {
                container(name: 'kaniko', shell: '/busybox/sh') {
                sh '''#!/busybox/sh
                    /kaniko/executor --context `pwd` --verbosity debug --destination=amidatech/saraswati-cql-execution:develop
                '''
                }
            }
        }
    }
}