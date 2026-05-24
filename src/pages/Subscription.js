import React, { useState } from 'react';
import { useApp, PLANS, generateOTP } from '../context/AppContext';
import OTPModal from '../components/OTPModal';
import toast from 'react-hot-toast';
import './Subscription.css';

export default function Subscription() {
  const { user, subscribePlan } = useApp();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSelectPlan = (plan) => {
    if (plan.id === user?.plan) { toast('You are already on this plan!'); return; }
    if (plan.price === 0) {
      subscribePlan('free');
      toast.success('Switched to Free plan.');
      return;
    }
    setSelectedPlan(plan);
    const newOtp = generateOTP();
    setOtp(newOtp);
    setShowOTP(true);
    // In production, OTP is sent to the user's registered email
    toast.success(`OTP sent to ${user?.email}!`, { duration: 5000 });
  };

  const handleOTPVerify = (entered) => {
    if (entered !== otp) { toast.error('Invalid OTP'); return false; }
    setShowOTP(false);
    setProcessing(true);
    setTimeout(() => {
      const result = subscribePlan(selectedPlan.id);
      setProcessing(false);
      if (result.error) { toast.error(result.error); return; }
      toast.success(`🎉 Subscribed to ${selectedPlan.name} Plan! Invoice sent to ${user?.email}.`);
      setSelectedPlan(null);
    }, 800);
    return true;
  };

  return (
    <div className="subscription-page">
      <div className="container">
        <div className="sub-header">
          <h1>Choose Your Plan</h1>
          <p>Upgrade to apply to more internships and unlock premium features</p>
        </div>

        <div className="plans-grid">
          {PLANS.map((plan) => {
            const isCurrent = user?.plan === plan.id;
            const isPopular = plan.id === 'bronze';
            return (
              <div
                key={plan.id}
                className={`plan-card card ${isCurrent ? 'current' : ''} ${isPopular ? 'popular' : ''}`}
                style={{ '--plan-color': plan.color }}
              >
                {isPopular && <div className="popular-badge">⭐ Most Popular</div>}
                {isCurrent && <div className="current-badge">✅ Current Plan</div>}

                <div className="plan-icon" style={{ background: plan.color + '22', color: plan.color }}>
                  {plan.id === 'free' ? '🆓' : plan.id === 'bronze' ? '🥉' : plan.id === 'silver' ? '🥈' : '🥇'}
                </div>

                <div className="plan-name" style={{ color: plan.color }}>{plan.name}</div>

                <div className="plan-price">
                  {plan.price === 0 ? (
                    <span className="price-free">Free</span>
                  ) : (
                    <>
                      <span className="price-currency">₹</span>
                      <span className="price-amount">{plan.price}</span>
                      <span className="price-period">/month</span>
                    </>
                  )}
                </div>

                <div className="plan-applications">
                  <span className="apps-count">
                    {plan.applications === Infinity ? '∞' : plan.applications}
                  </span>
                  <span className="apps-label">
                    {plan.applications === Infinity ? 'Unlimited Applications' : `Application${plan.applications > 1 ? 's' : ''}/month`}
                  </span>
                </div>

                <ul className="plan-perks-list">
                  {plan.perks.map(perk => (
                    <li key={perk}><span className="perk-check">✓</span>{perk}</li>
                  ))}
                </ul>

                <button
                  className={isCurrent ? 'btn-current' : plan.id === 'gold' ? 'btn-primary' : 'btn-outline'}
                  style={plan.id === 'gold' ? { background: plan.color, borderColor: plan.color, width: '100%', justifyContent: 'center', padding: '12px' } :
                         isCurrent ? {} : { width: '100%', justifyContent: 'center', padding: '12px', borderColor: plan.color, color: plan.color }}
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrent || processing}
                >
                  {isCurrent ? '✅ Current Plan' : plan.price === 0 ? 'Switch to Free' : `Subscribe for ₹${plan.price}`}
                </button>
              </div>
            );
          })}
        </div>

        <div className="sub-info-row">
          <div className="sub-info-card card">
            <div className="sub-info-icon">🔐</div>
            <div>
              <h4>OTP Verified Payments</h4>
              <p>Every payment requires OTP verification sent to your registered email for security.</p>
            </div>
          </div>
          <div className="sub-info-card card">
            <div className="sub-info-icon">📧</div>
            <div>
              <h4>Invoice by Email</h4>
              <p>After successful payment, an invoice with plan details is automatically sent to your email.</p>
            </div>
          </div>
          <div className="sub-info-card card">
            <div className="sub-info-icon">🔄</div>
            <div>
              <h4>Flexible Plans</h4>
              <p>Upgrade or downgrade your plan at any time. Applications reset at the start of each month.</p>
            </div>
          </div>
          <div className="sub-info-card card">
            <div className="sub-info-icon">💳</div>
            <div>
              <h4>Secure Checkout</h4>
              <p>Payments are processed securely. Cancel anytime from your account settings.</p>
            </div>
          </div>
        </div>

        <div className="comparison-table card">
          <h2>Plan Comparison</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th style={{ color: '#64748b' }}>Free</th>
                  <th style={{ color: '#cd7f32' }}>Bronze</th>
                  <th style={{ color: '#94a3b8' }}>Silver</th>
                  <th style={{ color: '#f59e0b' }}>Gold</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Applications/month</td><td>1</td><td>3</td><td>5</td><td>Unlimited</td></tr>
                <tr><td>Profile visibility</td><td>Basic</td><td>Priority</td><td>Boosted</td><td>Top</td></tr>
                <tr><td>Resume Builder</td><td>❌</td><td>✅</td><td>✅</td><td>✅</td></tr>
                <tr><td>Interview Prep</td><td>❌</td><td>❌</td><td>✅</td><td>✅</td></tr>
                <tr><td>Career Coaching</td><td>❌</td><td>❌</td><td>❌</td><td>✅</td></tr>
                <tr><td>Email Alerts</td><td>❌</td><td>✅</td><td>✅</td><td>✅</td></tr>
                <tr><td>Price</td><td>Free</td><td>₹100/mo</td><td>₹300/mo</td><td>₹1000/mo</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showOTP && selectedPlan && (
        <OTPModal
          title={`Subscribe to ${selectedPlan.name} Plan`}
          subtitle={`An OTP has been sent to ${user?.email} to verify your payment of ₹${selectedPlan.price}.`}
          onVerify={handleOTPVerify}
          onClose={() => { setShowOTP(false); setSelectedPlan(null); }}
          demoOtp={otp}
        />
      )}
    </div>
  );
}
