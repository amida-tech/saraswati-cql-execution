Message Queue
    input - Kafka Message
        Topic - found in .ENV, KAFKA_CONSUMED_TOPIC
        Header (patient-id) - valid patient id (string)
        Body (JSON Array as string) - valid patient and associated events FHIR JSON
    
    Output - Kafka Message
        Topic - found in .ENV, KAFKA_PRODUCED_TOPIC
        Body (JSON Array as string) - valid patient CQL results JSON 