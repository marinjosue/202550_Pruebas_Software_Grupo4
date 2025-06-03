const PaymentModel = require('../models/payment.model');
const CourseModel = require('../models/course.model');
const EnrollmentModel = require('../models/enrollment.model');

const processPayment = async (req, res) => {
    try {
        const { course_id, amount, method } = req.body;
        const user_id = req.user.id;
        
        // Validate payment method (must match ENUM values)
        const validMethods = ['transferencia', 'online', 'stripe', 'efectivo', 'paypal', 'tarjeta'];
        if (!validMethods.includes(method)) {
            return res.status(400).json({ 
                error: 'Método de pago inválido',
                validMethods: validMethods
            });
        }

        // Verify course exists
        const course = await CourseModel.findById(course_id);
        if (!course) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }

        // Process payment (simulation)
        const paymentId = await PaymentModel.create({
            user_id,
            course_id,
            amount,
            method
        });

        // Auto-enroll user after successful payment
        await EnrollmentModel.enroll(user_id, course_id, 'inscrito');

        res.status(201).json({
            message: 'Pago procesado exitosamente',
            paymentId,
            courseTitle: course.title
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar pago', details: error.message });
    }
};

const getPaymentHistory = async (req, res) => {
    try {
        const user_id = req.user.id;
        const payments = await PaymentModel.findByUser(user_id);
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener historial de pagos', details: error.message });
    }
};

module.exports = {
    processPayment,
    getPaymentHistory
};
